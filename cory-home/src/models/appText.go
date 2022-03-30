package models

type AppText struct {
	Model
	LanguageId uint     `json:"language_id" gorm:"not null"`
	Language   Language `json:"-" gorm:"foreignKey:LanguageId"`
	Type       uint     `json:"type"`
	Order      uint     `json:"order"`
	Image      string   `json:"image"`
	Text       string   `json:"text"`
}
