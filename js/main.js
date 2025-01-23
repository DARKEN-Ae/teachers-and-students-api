let form = document.querySelector("form");
let inputName = document.querySelector(".input-name");
let inputPhone = document.querySelector(".input-phone");
let inputMsg = document.querySelector(".input-msg");

let userLocation = null;

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log("Location obtained:", userLocation);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        alert("Joylashuvni olishda xatolik yuz berdi. Iltimos, ruxsat bering!");
      }
    );
  } else {
    alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let fullName = inputName.value.trim();
  let phoneNumber = inputPhone.value.trim();
  let inputMessage = inputMsg.value.trim();

  if (!fullName || !phoneNumber || !inputMessage) {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  const emoji = [
    { emoji: "✅", description: "check mark button" },
    { emoji: "📞", description: "telephone receiver" },
    { emoji: "📍", description: "location pin" },
    { emoji: "👤", description: "user" },
    { emoji: "💬", description: "speech balloon" },
  ];

  let locationInfo = userLocation
    ? `${emoji[2].emoji}<b> Manzili:</b> <i>${userLocation.latitude}, ${userLocation.longitude}</i>%0A`
    : `${emoji[2].emoji}<b> Manzili:</b> <i>Malumot berilmadi</i>%0A`;

  let my_text = `${emoji[3].emoji}<b> F.I.SH:</b> <i>${fullName}</i>%0A${emoji[1].emoji}<b> Tel.:</b> <i>${phoneNumber}</i>%0A${emoji[4].emoji}<b> Xabar:</b> <i>${inputMessage}</i>%0A${locationInfo}`;

  let token = "7761472526:AAG4llldleTeQ-glw-2TmuUlLYw1zhnINrM";
  let chat_id = -4665797146;
  let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}&parse_mode=html`;

  axios
    .get(url)
    .then((res) => {
      if (res.status === 200) {
        alert("Xabar muvaffaqiyatli yuborildi!");
      } else {
        alert("Xabar yuborishda xatolik yuz berdi.");
      }
    })
    .catch((error) => {
      console.error("Xatolik:", error.message);
      alert("Telegram API bilan ulanishda xatolik yuz berdi.");
    });

  inputName.value = "";
  inputPhone.value = "";
  inputMsg.value = "";
});

getUserLocation();
