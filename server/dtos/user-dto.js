export default class UserDto {
  name;
  surname;
  username;
  email;
  id;
  role;
  avatar;

  constructor(model) {
    this.username = model.Username ?? model.username;
    this.name = model.Name ?? model.name;
    this.surname = model.Surname ?? model.surname;
    this.email = model.Email ?? model.email;
    this.id = model.Id ?? model.id;
    this.role = model.Role ?? model.role ?? "user";
    this.avatar = model.Avatar ?? model.avatar;
  }
}
