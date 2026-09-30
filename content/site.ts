// All copy and data for the page. Components read from here and never hardcode text.
// Anything marked TODO(owner) is a placeholder for the site owner to edit.

export const site = {
  name: "YOUR NAME", // TODO(owner)
  role: "AI Engineer",
  focus: "Edge AI and Computer Vision",
  headline: "I build vision models that run on the device, not in the cloud.",
  intro:
    "AI Engineer working across the stack, from data and training to optimization and deployment. Strongest where models have to be fast, small, and reliable on real hardware.",
  links: { email: "", github: "", linkedin: "", upwork: "" }, // TODO(owner)
  linkLabels: {
    contact: "Contact",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    upwork: "Upwork",
  },

  headings: {
    pipeline: "One frame, from sensor to device",
    capabilities: "What I work on",
    approach: "How I work",
  },

  pipeline: {
    // Shown next to every number on the stage. The numbers are not measured results.
    note: "Illustrative numbers, not benchmarks.",
    steps: [
      {
        id: "capture",
        title: "Capture",
        body: "A camera sends one raw frame. Real sensors add grain and lose detail in poor light, so the model has to work with input like this.",
      },
      {
        id: "detect",
        title: "Detect",
        body: "The model finds three objects and draws a box around each one. The number on each box is the model's confidence.",
      },
      {
        id: "compress",
        title: "Compress",
        body: "I convert the weights from 32-bit floats to 8-bit integers. The goal is a model about four times smaller that still finds the same objects.",
      },
      {
        id: "deploy",
        title: "Deploy",
        body: "The smaller model runs on the device, next to the camera. Frames never leave the device, and each one takes less time to process.",
      },
    ],
    // Illustrative values for the diagram.
    detections: [
      { label: "person", confidence: 0.94 },
      { label: "car", confidence: 0.91 },
      { label: "box", confidence: 0.88 },
    ],
    modelSize: {
      label: "Model size",
      unit: "MB",
      before: { format: "FP32", value: 24 },
      after: { format: "INT8", value: 6 },
    },
    latency: { label: "Latency", unit: "ms", before: 180, after: 22 },
  },

  // TODO(owner): keep only what is genuinely done
  capabilities: [
    {
      group: "Vision",
      items: ["Detection", "Segmentation", "Tracking", "Anomaly detection"],
    },
    {
      group: "Model optimization",
      items: ["Quantization", "Pruning", "Export and runtime conversion"],
    },
    {
      group: "Deployment",
      items: ["Edge devices", "Embedded", "Real-time pipelines"],
    },
    {
      group: "Beyond vision",
      items: ["LLM and RAG apps", "Data pipelines", "MLOps basics"],
    },
  ],

  // TODO(owner): edit so this matches how you actually work
  approach: [
    {
      title: "Measure first",
      body: "Before I change anything, I measure the model on the device it will run on: speed, memory, and accuracy on real data. Those numbers decide what to work on first.",
    },
    {
      title: "Ship the smallest model that meets the spec",
      body: "I start from the requirement, such as a frame rate or a memory limit, and pick the smallest model that meets it. A smaller model costs less to run and is easier to update.",
    },
    {
      title: "Test on the target hardware",
      body: "A model that runs well on a workstation can be slow on a small board. I test on the target device early and keep testing there until release.",
    },
  ],

  contactLine: "If you have a model that needs to run on real hardware, email me.",
};
