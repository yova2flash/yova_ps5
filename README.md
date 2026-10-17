# YOVA PS5 - Relapse Exploit Suite

**YOVA PS5** is a modern, high-performance host and interface for the PS5 Relapse Exploit chain.

Supported firmware: **7.00 through 13.60**.

---

## Features
- **Orange / White / Orange Next-Gen UI**: Sleek glassmorphic theme designed for PS5 browser and desktop/mobile navigation.
- **Automated Firmware Detection**: Instant detection of console firmware from 7.00 to 13.60.
- **Payload Service Hub**: Built-in support for listening on port `9021` with quick-payload dispatch (`kstuff.elf`, `shadowmountplus.elf`, `etaHEN.elf`).
- **Interactive Live Terminal**: Real-time WebKit and Kernel exploit event stream with copy and filter options.

---

## Usage Instructions
1. **Network Configuration**:
   - In your PS5 Network Settings, configure Primary DNS to `45.56.67.85` (Recommended).
2. **Launch Host**:
   - Run `python serve.py` locally on your PC/server and navigate to `http://<YOUR_IP>:8000/` from your PS5 User's Guide browser.
   - Or access directly on your PS5 browser at: **https://yova2flash.github.io/yova_ps5/**
3. **Payload Dispatch**:
   - Once the exploit runs and the ELF loader starts listening on port `9021`, press **R2** on your DualSense controller to send `kstuff.elf`, `shadowmountplus.elf`, then `etaHEN.elf`.

---

## Logo Customization
To use your own logo:
- Place your image file named `logo.png` in the root folder alongside `index.html`.
- The interface will automatically load and fit your custom logo with glowing effects.

---

## Stability Notes
- The WebKit stage may require a few attempts. If the browser stalls, reload the page.
- If a kernel panic occurs, allow the console to reboot and rerun the page cleanly.

---

## Exploit Architecture
- **Browser Stage**: JavaScriptCore (JSC) information leak combined with structured clone object pool mismatch to corrupt a typedarray for arbitrary read/write.
- **Kernel Stage**: Address leak coupled with `aio_multi_wait` Use-After-Free (UAF) race condition to establish kernel read/write.

---

## Credits & Acknowledgments
- **YOVA** - Interface design & project customization.
- **Exploit Research & Payloads**: ntfargo, ufm42, Sonic-Iso, Jordy, Dr. Yenyen, TheFlow, SlidyBat, Flatz, cow, nhk, bollarz, Sleirsgoevy, EchoStretch, EarthOnion.

---

## Disclaimer
This project is strictly for **educational and security research purposes only**. It does not endorse piracy or unauthorized commercial access. Use only on hardware you own or have explicit permission to test.
