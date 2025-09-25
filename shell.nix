{pkgs ? import <nixpkgs> {} }:

pkgs.mkShell{
  packages = [pkgs.nodejs pkgs.watchman] ;

  shellHook = ''
    echo "Welcome to the shell"
  '';
}
