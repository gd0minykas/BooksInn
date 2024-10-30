export function generateFirebaseAuthErrorMessage(code: string) {
  console.log("Provided code: " + code);
  switch (code) {
    case "auth/invalid-credential":
      return "Provided User Credentials are invalid";

    case "auth/invalid-email":
      return "Provided Email is invalid";

    case "auth/missing-password":
      return "Password is missing";

    case "auth/missing-email":
      return "Email is missing";

    case "auth/password-does-not-meet-requirements":
      return "Password must be 8 characters long, must contain an upper case character and special character and a numeric character";

    case "repeatPassword does not match":
      return "Password and Repeat Password do not match";
  }
}
