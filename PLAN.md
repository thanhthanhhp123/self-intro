# Design plan

Bản kế hoạch thiết kế đã duyệt. `CLAUDE.md` vẫn là spec gốc; file này ghi lại các quyết định cụ thể để làm theo.

## Tiến độ

- [x] Task 1: layout, token, font, SmoothScroll, `site.ts`
- [ ] Task 2: Hero
- [ ] Task 3: EdgePipeline
- [ ] Task 4: Capabilities, Approach, Contact
- [ ] Task 5: polish, metadata, OG image, Lighthouse, deploy

## Quyết định đã chốt

1. Stage của pipeline là một khung chứa vài lớp SVG chồng lên nhau (frame + grain, box, thanh số liệu, thiết bị), không phải một thẻ `<svg>` duy nhất. Lý do: với một SVG, mỗi frame scrub phải vẽ lại trên main thread và filter grain (`feTurbulence`) chạy lại mỗi lần, rất nặng trên điện thoại. Tách lớp thì transform chạy trên GPU. Người xem vẫn thấy một stage.
2. Tắt Lenis khi `prefers-reduced-motion: reduce`.
3. Copy do Claude đề xuất (masthead, tiêu đề section, câu Contact, số illustrative) nằm trong `content/site.ts`, chủ trang sửa lúc nào cũng được.
4. Tên và link giữ placeholder `TODO(owner)` cho tới khi chủ trang điền.

## Ghi chú kỹ thuật

- `AGENTS.md` là file của Next.js. Nếu thiếu nó, `next dev` sẽ tự chèn khối hướng dẫn vào `CLAUDE.md`. Giữ file này để `CLAUDE.md` không bị sửa.
- Tailwind chỉ quét `app/` và `components/` (`@source` trong `globals.css`). Thêm thư mục mới có class Tailwind thì phải khai báo thêm.
- Bảng màu và thang cỡ chữ mặc định của Tailwind đã bị xoá: chỉ có class theo token (`bg-paper`, `text-ink`, `text-caption` … `text-display`).
- Lighthouse báo `NO_FCP` khi trang còn trống; từ Task 2 mới có điểm. Lighthouse 13.5 yêu cầu Node ≥ 22.19 (máy đang có 22.16, vẫn chạy nhưng có cảnh báo).

## 1. Token

```css
/* globals.css */
:root {
  --paper:#ECEEF0; --surface:#F7F8F9; --ink:#14181F; --muted:#5B6472;
  --grid:#C9CED6;  --signal:#1F4BFF;  --heat:#FF5A1F;
}
@theme inline {                      /* Tailwind v4 → bg-paper, text-ink… */
  --color-paper: var(--paper);       /* …tương tự cho 6 màu còn lại */
  --font-display: var(--font-bricolage);
  --font-body: var(--font-source-serif);
}
```

| Cỡ chữ | Giá trị | Dùng cho |
|---|---|---|
| caption | 14 | readout số, nhãn "illustrative", masthead |
| small | 16 | chữ thân bài trên mobile |
| body | 20 | chữ thân bài từ 768px, danh sách bước pipeline |
| h3 | 20 → 28 | tên nhóm Capabilities (mobile 20, desktop 28) |
| h2 | clamp(28 → 44) | tiêu đề section, email ở Contact |
| display | clamp(44 → 72) | headline Hero |

- Chữ: tiêu đề line-height khoảng 1.05, thân bài 1.65, mỗi dòng tối đa 65ch. Mọi con số dùng `tabular-nums`.
- Font: `next/font`, cả hai là font variable, subset latin, `display: swap`. Bricolage tải thêm trục `opsz`.
- Hairline: 1px `--grid`, chỉ để tách section và gom nhóm. Viền nút dùng `--ink` (`--grid` trên paper chỉ 1.4:1, không đủ để nhận ra nút).
- Góc vuông, không shadow. Chỉ outline thiết bị trong pipeline bo góc.
- Focus: `:focus-visible { outline: 2px solid var(--signal); outline-offset: 2px }`.
- Container tối đa 1200px, lề 16px dưới 768px và 32px từ 768px. Lưới 12 cột từ 1024px.
- Tương phản (đã tính): muted/paper 5.1, signal/paper 5.2, muted/surface 5.6, đều đạt AA. heat/paper chỉ 2.7, nên không dùng cho chữ: số latency luôn là chữ `--ink`, `--heat` chỉ tô thanh bar.

## 2. Ý tưởng bố cục

- Trang sổ lab: đầu trang có một dòng masthead mỏng (tên trái, vai trò phải, hairline bên dưới). Mỗi section sau Hero mở đầu bằng một hairline ngang; tiêu đề ở cột lề trái (4/12), nội dung ở cột phải (8/12). Mobile: tiêu đề nằm trên nội dung.
- Họa tiết duy nhất là góc ngắm (viewfinder bracket): vẽ một lần quanh headline Hero, và đứng yên quanh stage pipeline. Không dùng ở đâu khác.
- Chuyển động chỉ có ở Hero (một lần khi load) và Pipeline (scrub). Các section khác đứng yên, chỉ link đổi trạng thái khi hover/focus.

## 3. Wireframe

### Hero (min-h 100svh)

```
 YOUR NAME               AI Engineer · Edge AI and Computer Vision
 ─────────────────────────────────────────────────────────────────

 ┌─                                                ─┐
   I build vision models that run
   on the device, not in the cloud.        ← display
 └─                                                ─┘

   AI Engineer working across the stack, from data and
   training to optimization and deployment. Strongest
   where models have to be fast, small, and reliable
   on real hardware.

   [ Contact ]   GitHub
```

- Mobile: masthead xếp 2 dòng, headline cỡ 44 khoảng 5 dòng, vẫn gọn trong một màn hình.
- "Contact" là nút viền ink, cao ≥ 44px, trỏ tới `#contact`. "GitHub" là link chữ màu signal, gạch chân. Không mũi tên.
- Load: 4 góc ngắm nét 1.5px màu ink, vẽ bằng stroke-dashoffset trong khoảng 0.8s, chạy sau `document.fonts.ready`. Headline không animate (không làm chậm LCP). Reduced motion: góc hiện sẵn.

### EdgePipeline (từ 1024px, pinned, `end: +=400%`)

```
 ─────────────────────────────────────────────────────────────────
 One frame, from          ┌─                                   ─┐
 sensor to device           ┌────────────────────────────────┐
                            │░▒░░░░▒░░░ grain ░░░░▒░░░░░░▒░░░│
 ┃ 1  Capture               │░┌──────┐0.94░░░░░░░░░░░░░░░░░░░│
 ┃ 2  Detect    ← ink       │░│      │░░░░░┌─────┐0.91░░░░░░░│
 │ 3  Compress  ← muted     │░└──────┘░░░░░└─────┘░░┌───┐0.88░│
 │ 4  Deploy                └────────────────────────────────┘
 (thanh dọc tô signal       Model size ██████████  FP32 24 MB  (bước 3)
  theo tiến độ)             Latency    ██████████  180 ms      (bước 4)
                            Illustrative numbers, not benchmarks
 Đoạn giải thích          └─                                   ─┘
 đổi theo bước.
```

| Bước | Stage thay đổi | Thuộc tính animate |
|---|---|---|
| 1 Capture | Khung xám "phơi sáng": lớp grain hiện trước, rồi tới cảnh | opacity |
| 2 Detect | 3 box vẽ nét, chip confidence hiện ra | stroke-dashoffset, opacity |
| 3 Compress | Thanh model size co từ FP32 xuống INT8 (scaleX 1 → 0.25), nhãn đổi bằng crossfade, box đứng yên | transform, opacity |
| 4 Deploy | Outline thiết bị vẽ ra; frame và box thu nhỏ rồi dịch vào màn hình thiết bị; thanh latency co lại, lớp heat mờ dần để lộ lớp signal; số đếm lùi 180 → 22 ms | stroke-dashoffset, transform, opacity |

- Số latency đổi text trong một ô rộng cố định, dùng tabular-nums, nên layout không xô lệch.
- Mọi con số nằm trong `site.ts` và được ghi là illustrative.
- Cảnh trong frame: 3 vật thể xám đơn giản (người, xe, thùng hàng), tông sáng để box `--signal` nổi rõ. Chip confidence nền signal, chữ paper.
- 768–1023px: vẫn dùng khoảng pin desktop, nhưng chữ ở trên, stage ở dưới.

Mobile (< 768px, `+=250%`):

```
 One frame, from sensor to device
 1 Capture  2 Detect  3 Compress  4 Deploy    ← bước đang chạy = ink
 ━━━━━━━━━━━━━━━━━━──────────────────────     ← tiến độ (scaleX)
 Three boxes draw in, each with a
 confidence score.
 ┌─────────────────────────────────┐
 │ frame, grain nhẹ hơn            │
 │  ┌───┐0.94   ┌──┐0.91          │
 └─────────────────────────────────┘
 Size     ███  INT8 6 MB
 Latency  ██   22 ms
 Illustrative numbers
```

Reduced motion (mọi kích thước): không pin, không scrub. 4 bước xếp dọc, mỗi bước có chữ và hình ở trạng thái cuối của bước đó.

```
 1 Capture    text     [chỉ có frame]
 2 Detect     text     [frame + box]
 3 Compress   text     [+ thanh INT8]
 4 Deploy     text     [frame trong thiết bị, 22 ms]
```

Cách dựng:

- Stage nhiều lớp SVG (quyết định 1).
- Cả bản pinned lẫn bản xếp dọc đều có sẵn trong HTML; CSS (`motion-safe:` / `motion-reduce:`) quyết định bản nào hiện, nên không bị hydration mismatch và không nháy khi load. GSAP chỉ khởi tạo trong `gsap.matchMedia()`.
- Section đặt `overflow-x: clip`. Pin không được giật khi thanh địa chỉ mobile co giãn (ScrollTrigger `ignoreMobileResize`).

### Capabilities

```
 ─────────────────────────────────────────────────────────────────
 What I work on       ──────────────────    ──────────────────
                      Vision                Model optimization
                      Detection             Quantization
                      Segmentation          Pruning
                      Tracking              Export and runtime
                      Anomaly detection     conversion

                      ──────────────────    ──────────────────
                      Deployment            Beyond vision
                      Edge devices          LLM and RAG apps
                      Embedded              Data pipelines
                      Real-time pipelines   MLOps basics
```

Hairline trên mỗi nhóm để gom nhóm. Các mục dùng font serif. Mobile 1 cột. Không card, không đánh số, không hover.

### Approach

```
 ─────────────────────────────────────────────────────────────────
 How I work           Measure first
                      Two or three sentences, serif, max 65ch.

                      Ship the smallest model that meets the spec
                      …

                      Test on the target hardware
                      …
```

Ba đoạn xếp dọc trong một cột đọc, không chia 3 cột, không đánh số.

### Contact (phần duy nhất căn giữa)

```
 ─────────────────────────────────────────────────────────────────

   If you have a model that needs to run on real hardware, email me.

                        you@example.com           ← h2, signal
                   GitHub     LinkedIn     Upwork      ← ≥ 44px
```

Link nào trong `site.ts` còn rỗng thì ẩn.

## 4. Đối chiếu với CLAUDE.md

- Không eyebrow viết hoa giãn chữ: masthead là tên và vai trò, cỡ 14 chữ thường, tách khỏi headline bằng hairline.
- Đánh số chỉ có ở pipeline, dạng 1–4, không phải 01.
- Không card, không shadow, không gradient.
- Không tô màu riêng một từ trong headline, không mũi tên sau link.
- Không fade-up hay hover tràn lan.
- Chỉ animate transform, opacity, stroke-dashoffset. Ngoại lệ duy nhất: text của số latency, như spec yêu cầu.
- `--heat` chỉ có trong pipeline; mọi số đều có nhãn illustrative; chữ căn trái ở mọi nơi trừ Contact.
