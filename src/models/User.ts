export interface User {
    email: string;
    password: string;
    nom: string;
    lastname: string;
    firstname: string;
    prenom: string;
    birthday: Date;
    pictureURL: string;
    facebook: boolean;
    statut: string;
    biography: string;
    eventsLiked: Array<string|number>;
}