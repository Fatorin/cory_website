package models

type Image struct {
	Model
	Name  string `json:"name"`
	Tag   uint   `json:"tag"`
	Image string `json:"image"`
}
