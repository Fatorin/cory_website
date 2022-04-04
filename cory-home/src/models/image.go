package models

type Image struct {
	Model
	Name  string `json:"Name"`
	Tag   string `json:"tag"`
	Image string `json:"image"`
}
