package models

type Component struct {
	Model
	Type          uint   `json:"type"`
	Order         uint   `json:"order"`
	Image         string `json:"image"`
	Text          string `json:"text"`
	CustomSetting string `json:"custom_setting"`
}
