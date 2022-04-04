package database

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type HashCache struct {
	Key   string
	Field string
}

var Cache *redis.Client
var CacheChannel chan string
var HashCacheChannel chan HashCache

func SetupRedis(password string) {
	Cache = redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		DB:       0,
		Password: password,
	})
}

func SetupCacheChannel() {
	CacheChannel = make(chan string)

	go func(ch chan string) {
		for {
			time.Sleep(5 * time.Second)

			key := <-ch

			Cache.Del(context.Background(), key)

			fmt.Println("Cache cleared " + key)
		}
	}(CacheChannel)
}

func ClearCache(keys ...string) {
	for _, key := range keys {
		CacheChannel <- key
	}
}

func SetupHashCacheChannel() {
	HashCacheChannel = make(chan HashCache)

	go func(ch chan HashCache) {
		for {
			time.Sleep(5 * time.Second)

			hashCache := <-ch

			Cache.HDel(context.Background(), hashCache.Key, hashCache.Field)

			fmt.Printf("Cache cleared key=%v, value= %v\n", hashCache.Key, hashCache.Field)
		}
	}(HashCacheChannel)
}

func ClearHashCache(hashCaches ...HashCache) {
	for _, hashCache := range hashCaches {
		HashCacheChannel <- hashCache
	}
}
