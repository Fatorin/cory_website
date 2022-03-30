package util

import "time"

type CheerMomet struct {
	Prefix       string           `json:"prefix"`
	Tiers        []CheerMometTier `json:"tiers"`
	Type         string           `json:"type"`
	Order        int              `json:"order"`
	LastUpdated  time.Time        `json:"last_updated"`
	IsCharitable bool             `json:"is_charitable"`
}

type CheerMometTier struct {
	MinBits        int                        `json:"min_bits"`
	ID             string                     `json:"id"`
	Color          string                     `json:"color"`
	Images         map[string]CheerMometImage `json:"images"`
	CanCheer       bool                       `json:"can_cheer"`
	ShowInBitsCard bool                       `json:"show_in_bits_card"`
}

type CheerMometImage struct {
	Animated map[string]string `json:"animated"`
	Static   map[string]string `json:"static"`
}

type CheerMometResponse struct {
	Data []CheerMomet `json:"data"`
}

type Stamp struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Images     map[string]string `json:"images"`
	Tier       string            `json:"tier"`
	EmoteType  string            `json:"emote_type"`
	EmoteSetID string            `json:"emote_set_id"`
	Format     []string          `json:"format"`
	Scale      []string          `json:"scale"`
	ThemeMode  []string          `json:"theme_mode"`
}

type StampResponse struct {
	Data     []Stamp `json:"data"`
	Templete string  `json:"template"`
}

type Badge struct {
	SetID    string              `json:"set_id"`
	Versions []map[string]string `json:"versions"`
}

type BadgeReponse struct {
	Data []Badge `json:"data"`
}

type InfoData struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type EmoteData struct {
	Tier  int        `json:"tier"`
	Datas []InfoData `json:"datas"`
}

const (
	Follower = iota
	Tier1
	Tier2
	Tier3
	BitsTier
)
