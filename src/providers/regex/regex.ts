
import { Injectable } from '@angular/core';

@Injectable()
export class RegexProvider {

  constructor() {}

  /**
   *  Test si un mot de passe contient :
   *      - 8 caractères
   *      - 1 lettre
   *      - 1 nombre
   * @param   {string}    password Mot de passe
   * @returns {boolean}   True => Valide
   */
  password(password: string): boolean {
      let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return re.test(password)
  }

  /**
   * Test si une adresse email est valide
   * 
   * @param {string} email Email
   * @returns {boolean} True => Valide
   */
  email(email: string): boolean {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  urlify(text: string) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
  }
}
