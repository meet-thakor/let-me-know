document.addEventListener("DOMContentLoaded", () => {
  const CIRCLES = {
    a: {
      x: 0,
      y: -150,
      unit: 150,
      speed: 900,
    },
    b: {
      x: 0,
      y: -230,
      unit: 230,
      speed: 1800,
    },
    c: {
      x: 0,
      y: -310,
      unit: 310,
      speed: 3600,
    },
    d: {
      x: 0,
      y: -390,
      unit: 390,
      speed: 5400,
    },
    e: {
      x: 0,
      y: -470,
      unit: 470,
      speed: 5400,
    },
    f: {
      x: 0,
      y: -550,
      unit: 550,
      speed: 5400,
    },
    g: {
      x: 0,
      y: -630,
      unit: 630,
      speed: 5400,
    },
    h: {
      x: 0,
      y: -710,
      unit: 710,
      speed: 5400,
    }
  };

  const DOTS = {
    // A
    mercury: {
      startAngle: 1000,
      circle: "a",
    },
    // B
    venus: {
      startAngle: -1000,
      circle: "b",
    },
    // C
    earth: {
      startAngle: 0,
      circle: "c",
    },
    // D
    mars: {
      startAngle: 1000,
      circle: "d",
    },
    // E
    jupiter: {
      startAngle: 0,
      circle: "e",
    },
    // F
    saturn: {
      startAngle: -1000,
      circle: "f",
    },
    // G
    uranus: {
      startAngle: 0,
      circle: "g",
    },
    // H
    neptune: {
      startAngle: 1000,
      circle: "h",
    },

  };

  const animate = (el, id) => {
    let { startAngle, circle } = DOTS[id];
    let { unit, speed, x, y } = CIRCLES[circle];
    el.style.setProperty("--animation-delay", `var(--circle-delay-${circle})`);

    const rad = startAngle * (Math.PI / speed);
    const left = Math.cos(rad) * unit + x;
    const top = unit * (1 - Math.sin(rad)) + y;
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    el.style.transform = transform;
    DOTS[id].startAngle = DOTS[id].startAngle - 1;
  };

  const $dots = document.querySelectorAll(".js-dot");
  const reducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  $dots.forEach(($dot) => {
    const id = $dot.dataset.id;
  if (!DOTS[id]) {
    console.warn(`Missing DOTS config for id: ${id}`);
    return;
  }
  
    if (reducedMotion) {
      animate($dot, id);
    } else {
      setInterval(() => {
        animate($dot, id);
      }, 10);
    }
  });

  // Grid

  const $columns = Array.prototype.slice.call(
    document.querySelectorAll("#grid > .column"),
    0,
  );
  const $markup = document.querySelector("#markup code");
  const $message = document.getElementById("message");
  const $add = document.getElementById("add");
  const $remove = document.getElementById("remove");
  let showing = 5;

  function showColumns() {
    if (showing === 13) {
      $message.style.display = "block";
    } else {
      $message.style.display = "none";
    }

    showing = Math.min(Math.max(parseInt(showing), 1), 12);

    $columns.forEach(($el) => {
      $el.style.display = "none";
    });
    $columns.slice(0, showing).forEach(($el) => {
      $el.style.display = "block";
    });

    $markup.innerHTML =
      '<span class="nt">&lt;div</span> <span class="na">class=</span><span class="s">&quot;columns&quot;</span><span class="nt">&gt;</span>';
    $markup.insertAdjacentHTML("beforeend", "\n");

    for (let i = 0; i < showing; i++) {
      $markup.insertAdjacentHTML(
        "beforeend",
        '  <span class="nt">&lt;div</span> <span class="na">class=</span><span class="s">&quot;column&quot;</span><span class="nt">&gt;</span>',
      );
      $markup.insertAdjacentHTML("beforeend", i + 1);
      $markup.insertAdjacentHTML(
        "beforeend",
        '<span class="nt">&lt;/div&gt;</span>',
      );
      $markup.insertAdjacentHTML("beforeend", "\n");
    }

    $markup.insertAdjacentHTML(
      "beforeend",
      '<span class="nt">&lt;/div&gt;</span>',
    );
  }

if ($add) {
  $add.addEventListener("click", () => {
    showing++;
    showColumns();
  });
}

if ($remove) {
  $remove.addEventListener("click", () => {
    showing--;
    showColumns();
  });
}

});
