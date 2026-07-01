"""Initialize git repo, commit, and push to GitHub for Netlify CI."""
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\vergio\Documents\projects\GamerLeech")
REPO_NAME = "gamerleech"


def run(cmd, cwd=ROOT, check=False):
    print(f"\n>>> {' '.join(cmd)}")
    r = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True, shell=False)
    out = (r.stdout or "") + (r.stderr or "")
    if out.strip():
        print(out.strip())
    if check and r.returncode != 0:
        sys.exit(r.returncode)
    return r.returncode, out


def main():
    os.chdir(ROOT)

    # Isolated repo in GamerLeech only
    if not (ROOT / ".git").is_dir():
        run(["git", "init", "-b", "main"], check=True)
        print("Initialized git repo in GamerLeech")

    run(["git", "config", "user.name"], check=False)
    name_rc, name_out = run(["git", "config", "user.name"])
    if name_rc != 0 or not name_out.strip():
        run(["git", "config", "user.email", "gamerleech2@gmail.com"], check=True)
        run(["git", "config", "user.name", "GamerLeech"], check=True)

    run(["git", "add", ".gitignore", "README.md", "netlify.toml", "netlify-deploy/", "docs/", "tools/"])
    run(["git", "add", "-u"])
    rc, status = run(["git", "status", "--short"])
    if not status.strip():
        print("Nothing to commit.")
    else:
        run([
            "git", "commit", "-m",
            "Add GamerLeech v2 site for Netlify GitHub auto-deploy\n\n"
            "- netlify-deploy: production static site\n"
            "- Discord, terms, refund, mobile dock\n"
            "- Root netlify.toml publish=netlify-deploy"
        ], check=True)

    # GitHub
    gh_rc, _ = run(["gh", "auth", "status"])
    if gh_rc != 0:
        print("\n*** gh not logged in. Run: gh auth login ***")
        print("Then re-run this script or:")
        print(f'  gh repo create {REPO_NAME} --public --source=. --remote=origin --push')
        return 1

    _, remotes = run(["git", "remote", "-v"])
    if "origin" not in remotes:
        rc, out = run(["gh", "repo", "create", REPO_NAME, "--public", "--source=.", "--remote=origin", "--push"])
        if rc != 0:
            # repo may exist — try link
            run(["gh", "repo", "view", REPO_NAME, "--json", "url"])
            user_rc, user_out = run(["gh", "api", "user", "-q", ".login"])
            if user_rc == 0:
                login = user_out.strip()
                run(["git", "remote", "add", "origin", f"https://github.com/{login}/{REPO_NAME}.git"])
                run(["git", "push", "-u", "origin", "main"], check=True)
        else:
            print("Created and pushed to GitHub.")
    else:
        run(["git", "push", "-u", "origin", "main"], check=True)
        print("Pushed to origin/main.")

    _, url_out = run(["gh", "repo", "view", "--json", "url", "-q", ".url"])
    if url_out.strip():
        print(f"\nGitHub repo: {url_out.strip()}")
        print("Netlify: Import this repo → publish dir netlify-deploy (from netlify.toml)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
