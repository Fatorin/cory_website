package util

import (
	"context"
	"cory-home/src/database"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/oauth2/twitch"
)

const TWITCH_CACHE_CHEERS string = "TWITCH_CACHE_CHEERS"
const TWITCH_CACHE_EMOTES string = "TWITCH_CACHE_EMOTES"
const TWITCH_CACHE_BADGES string = "TWITCH_CACHE_BADGES"

var (
	oauth2Config *clientcredentials.Config
	currectToken *oauth2.Token
)

func SetupTwitchAPISchedule() {
	fmt.Println("Twitch API Schedule Start.")
	go func() {
		for {
			time.Sleep(time.Hour * 24)
			CheckTokenAndGetData()
		}
	}()
}

func saveToRedis(key string, infoDatas []InfoData) {
	var ctx = context.Background()

	bytes, err := json.Marshal(infoDatas)

	if err != nil {
		panic(err)
	}

	err = database.Cache.Set(ctx, key, bytes, 0).Err()
	if err != nil {
		panic(err)
	}

	fmt.Println("Cahce updated")
}

func saveToRedisEmotes(key string, emoteDatas []EmoteData) {
	var ctx = context.Background()

	bytes, err := json.Marshal(emoteDatas)

	if err != nil {
		panic(err)
	}

	err = database.Cache.Set(ctx, key, bytes, 0).Err()
	if err != nil {
		panic(err)
	}

	fmt.Println("Cahce updated")
}

func analyzeStamp(text []byte) {
	var resp StampResponse
	err := json.Unmarshal(text, &resp)
	if err != nil {
		fmt.Println("Analyze Fail.")
		return
	}

	stampDatas := make(map[int][]InfoData)
	for _, stamp := range resp.Data {
		var stampData InfoData
		var format string
		for _, value := range stamp.Format {
			format = value
		}

		stampData.Name = stamp.Name
		stampData.URL = (createURL(stamp.ID, format, stamp.ThemeMode[0], stamp.Scale[2]))
		stampDatas[getTierNumber(stamp.Tier, stamp.EmoteType)] = append(stampDatas[getTierNumber(stamp.Tier, stamp.EmoteType)], stampData)
	}

	var emoteDatas []EmoteData
	for key, value := range stampDatas {
		var emoteData EmoteData
		emoteData.Tier = key
		emoteData.Datas = value
		emoteDatas = append(emoteDatas, emoteData)
	}
	saveToRedisEmotes(TWITCH_CACHE_EMOTES, emoteDatas)
}

func analyzeBadges(text []byte) {
	var resp BadgeReponse
	err := json.Unmarshal(text, &resp)
	if err != nil {
		fmt.Println("Analyze Fail.")
	}

	var infoDatas []InfoData
	for _, badge := range resp.Data {
		if badge.SetID == "subscriber" {
			for _, data := range badge.Versions {
				var infoData InfoData
				infoData.Name = data["id"]
				infoData.URL = data["image_url_4x"]
				infoDatas = append(infoDatas, infoData)
			}
			break
		}
	}

	saveToRedis(TWITCH_CACHE_BADGES, infoDatas)
}

func analyzeCheerMoment(text []byte) {
	var resp CheerMometResponse
	err := json.Unmarshal(text, &resp)
	if err != nil {
		fmt.Println("Analyze Fail.")
	}

	var cheerDatas []InfoData
	for _, v := range resp.Data {
		if v.Prefix == "cooryCheer" {
			for _, tier := range v.Tiers {
				var infoData InfoData
				infoData.Name = tier.ID
				for key, image := range tier.Images {
					if key == "light" {
						infoData.URL = image.Animated["4"]
					}
				}
				cheerDatas = append(cheerDatas, infoData)
			}
			break
		}
	}

	saveToRedis(TWITCH_CACHE_CHEERS, cheerDatas)
}

func createURL(id string, format string, themeMode string, scale string) string {
	return fmt.Sprintf("https://static-cdn.jtvnw.net/emoticons/v2/%s/%s/%s/%s", id, format, themeMode, scale)
}

func getTierNumber(tier string, emoteType string) int {
	switch tier {
	case "":
		if emoteType == "follower" {
			return Follower
		} else if emoteType == "bitstier" {
			return BitsTier
		}
		return -1
	case "1000":
		return Tier1
	case "2000":
		return Tier2
	case "3000":
		return Tier3
	default:
		return -1
	}
}

func getToken() {
	oauth2Config = &clientcredentials.Config{
		ClientID:     os.Getenv("TWITCH_API_ID"),
		ClientSecret: os.Getenv("TWITCH_API_SECRET"),
		TokenURL:     twitch.Endpoint.TokenURL,
	}

	token, err := oauth2Config.Token(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	currectToken = token
}

func ForceGet() {
	getToken()
	getToken()
}

func CheckTokenAndGetData() {
	if currectToken == nil {
		getToken()
	}

	if time.Since(currectToken.Expiry) > -time.Hour*24*30 {
		getToken()
	}

	FetchData()
}

func FetchData() {
	go getQuery("https://api.twitch.tv/helix/chat/emotes", analyzeStamp)
	go getQuery("https://api.twitch.tv/helix/chat/badges", analyzeBadges)
	go getQuery("https://api.twitch.tv/helix/bits/cheermotes", analyzeCheerMoment)
}

func getQuery(url string, callBack func(text []byte)) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		fmt.Println(err)
		return
	}

	token := "Bearer " + currectToken.AccessToken
	req.Header = http.Header{
		"Authorization": []string{token},
		"Client-Id":     []string{oauth2Config.ClientID},
	}

	q := req.URL.Query()
	q.Add("broadcaster_id", "555601912")

	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return
	}
	defer resp.Body.Close()

	respText, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	callBack(respText)
}
