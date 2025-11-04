function subscribe() {
    alert("Thank you for subscribing! Discount Coupon Sent.");
}
document.body.style.background = "linear-gradient(90deg, #2b1748 0%, #4a2066 25%, #6d2c7f 50%, #8e3893 75%, #a53d98 100%)";


const startBtn = document.getElementById('startBtn');
    const popup = document.getElementById('popup');
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const nextBtn = document.getElementById('nextBtn');
    const resultEl = document.getElementById('result');
    const shoeResults = document.getElementById('shoeResults');

    let answers = {};
    let step = 0;

    const questions = [
      { q: "Where are you going?", options: ["Party", "Office", "Gym", "Casual"] },
      { q: "What's your dress color?", options: ["Black", "White", "Red", "Blue", "Beige"] },
      { q: "Is it for Morning or Night?", options: ["Morning", "Night"] }
    ];

    startBtn.onclick = () => {
      startBtn.classList.add('hidden');
      popup.classList.remove('hidden');
      showQuestion();
    };

    function showQuestion() {
      const { q, options } = questions[step];
      typeText(questionEl, q);
      optionsEl.innerHTML = '';
      options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => {
          answers[`q${step}`] = option;
          nextBtn.classList.remove('hidden');
        };
        optionsEl.appendChild(btn);
      });
      nextBtn.classList.add('hidden');
    }

    nextBtn.onclick = () => {
      step++;
      if (step < questions.length) {
        showQuestion();
      } else {
        popup.classList.add('hidden');
        generateRecommendation();
      }
    };

    function typeText(element, text) {
      element.textContent = "";
      let i = 0;
      const typingInterval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i > text.length) clearInterval(typingInterval);
      }, 50);
    }

    async function generateRecommendation() {
      const { q0: occasion, q1: color, q2: time } = answers;
      const query = `${color} ${occasion} ${time} shoes`;
      const accessKey = "jcZPPtQeTviKnMBpm5ddSMekiQVyc1Ea_Yklf8Vb8dY"; // Replace with your Unsplash key
      const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&client_id=${accessKey}`;

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        shoeResults.innerHTML = "";

        if (data.results.length === 0) {
          shoeResults.innerHTML = "<p>No matching shoes found — try different answers!</p>";
        } else {
          data.results.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo.urls.small;
            img.alt = photo.alt_description;
            shoeResults.appendChild(img);
          });
        }
        resultEl.classList.remove("hidden");
      } catch (error) {
        console.error("Error fetching from Unsplash:", error);
        shoeResults.innerHTML = "<p>Unable to fetch images. Try again later.</p>";
      }
    }