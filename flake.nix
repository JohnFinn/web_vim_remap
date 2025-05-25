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
    packages.${system}.firefox_extension =
      # copy-pasted and modified from https://github.com/nix-community/nur-combined/blob/87ffa62e85cd000fdd2cb0e5ef9d5a9cf3c2eef4/repos/rycee/pkgs/firefox-addons/default.nix#L5-L25
      let
        addonId = "hackce@nanigashi.stackoverflow";
      in
        pkgs.stdenv.mkDerivation {
          name = "hackce-0.1";

          src = pkgs.fetchFromGitHub {
            owner = "JohnFinn";
            repo = "web_vim_remap";
            rev = "2018d5ab83963b4cff6aaf7a1b8eae807004ad68";
            sha256 = "sha256-sQ2IlGUJr3Vded+yse9gDCSCkCJhhRS5+w9sHFN4UKs=";
          };

          preferLocalBuild = true;
          allowSubstitutes = true;

          passthru = {inherit addonId;};

          nativeBuildInputs = [pkgs.web-ext];

          buildCommand = ''
            web-ext build --source-dir "$src"
            dst="$out/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}"
            mkdir -p "$dst"
            install -v -m644 "web-ext-artifacts/hackce-0.1.zip" "$dst/${addonId}.xpi"
          '';
        };
  };
}
