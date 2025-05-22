
{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.python3Packages.pip
    pkgs.python3Packages.flask
    pkgs.python3Packages.flask-cors
    pkgs.python3Packages.python-dotenv
    pkgs.nodejs-20_x
  ];
}
