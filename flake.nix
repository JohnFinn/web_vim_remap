{
  inputs = {nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";};
  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    nativeBuildInputs = with pkgs; [
      (pkgs.python3.withPackages
        (ps: [ps.mitmproxy]))
    ];
  in {
    devShells.${system}.default = pkgs.mkShell.override {stdenv = pkgs.clangStdenv;} {
      inherit nativeBuildInputs;
    };
  };
}
