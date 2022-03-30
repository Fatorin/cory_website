package models

import "golang.org/x/crypto/bcrypt"

type User struct {
	Model
	Username string `json:"username"`
	Password []byte `json:"-"`
	Email    string `json:"email"`
}

func (user *User) SetPassword(password string) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 12)
	user.Password = hashedPassword
}

func (user *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword(user.Password, []byte(password))
}
