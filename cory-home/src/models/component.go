package models

type Component struct {
	Model
	Type          uint   `json:"type"`
	Image         string `json:"image"`
	Text          string `json:"text"`
	CustomSetting string `json:"custom_setting"`
}
