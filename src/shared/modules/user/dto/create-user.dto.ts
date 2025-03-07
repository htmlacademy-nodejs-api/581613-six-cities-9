export class CreateUserDto {
  public name: string;
  public email: string;
  public password: string;
  public isPro: boolean;
  public avatar?: string;
}
