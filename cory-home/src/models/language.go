package models

type Language struct {
	Model
	Region    string `json:"region" gorm:"unique;not null"`
	Name      string `json:"name" gorm:"not null"`
	NickName  string `json:"nick_name" gorm:"not null"`
	Available *bool  `json:"available" gorm:"false"`
}
