import subprocess
import datetime

def auto_push():
    # Ambil waktu saat ini untuk pesan commit otomatis
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Auto update - {now}"

    try:
        print("1. Menandai semua perubahan (git add)...")
        subprocess.run(["git", "add", "."], check=True)

        print(f"2. Membuat commit: '{commit_message}'...")
        subprocess.run(["git", "commit", "-m", commit_message], check=True)

        print("3. Mengirim perubahan ke GitHub (git push)...")
        subprocess.run(["git", "push"], check=True)

        print("\nSUCCESS: Project berhasil di-push ke GitHub!")
    except subprocess.CalledProcessError as e:
        print(f"\nERROR: Terjadi kesalahan saat menjalankan perintah Git.\n{e}")

if __name__ == "__main__":
    auto_push()