const services = [
    {
        name: "Leak Repairs",
        price: 450,
        response: "Same day service available.", desc: "Fast repair of leaking pipes, taps and geysers"
    },
    {
        name: "Blocked Drains", price: 550,
        response: "Same day servive available", desc: "Drain unblocking with professional tools"
    },
    {
        name: "Geyser Instalation", price: 3500, response: "Bookings within 2 working days",
        desc: "Supply and install a new geyser with a warranty."
    },
    {
        name: "Bathroom Renovations", price: 15000, response: "24/7",
        desc: "Emergency call-out for burst pipes"
    }
];

// Service Page
const listBox = document.getElementById("ServicesList");
if(listBox){
    const searchInput = document.getElementById("ServiceSearch");
    const sortSelect = document.getElementById("serviceSort");
    const noResults = document.getElementById("noResults");

    function showService(){
        const term = searchInput.value.trim().toLowerCase();
        let result = services.filter(s => s.name.toLocaleLowerCase.includes(term) ||
        s.desc.toLocaleLowerCase().includes(term));

        if(sortSelect.value === "name") result.sort((a, b) => a.name.localeCompare(b.name));
        if(sortSelect.value === "price-low") result.sort((a,b) => a.price - b.price);
        if(sortSelect.value === "price-high") result.sort((a,b) => b.price - a.price);

        listBox.innerHTML ="";
        result.forEach(s => {
            const card = document.createElement("article");
            card.className = "card";
            card.innerHTML = `
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <p><strong>Price: $${s.price.toFixed(2)}</strong></p>
                <p>${s.response}</p>
            `;
            listBox.appendChild(card);
        });
        noResults.hidden = results.length !== 0;
    }

    searchInput.addEventListener("input", showService);
    sortSelect.addEventListener("change", showService);
    showService();
}

// FAQ
document.querySelectorAll(".accordion-header").forEach(btn => {
    btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
    });
});

// LightBox
const lightbox = document.getElementById("lightbox");
if(lightbox){
    const bigImg = lightbox.querySelector("img");
    const caption = lightbox.querySelector("figcaption");
    document.querySelectorAll(".gallery img").forEach(img => 
        {img.addEventListener("click", () => {
            bigImg.src = img.dataset.full || img.src;
            bigImg.alt = img.alt;
            caption.textContent = img.alt;
            lightbox.classList.add("open");
        });
    });

    const close = () => lightbox.classList.remove("open");
    lightbox.addEventListener("click", e => {if(e.target !== bigImg) close();});
    document.addEventListener("keydown", e => {if(e.key === "Escape") close();});
}

// Interactive Map
const mapBox = document.getElementById("map");
if(mapBox && typeof L !== "undefined"){
    const braamfontein = [-26.1929,28.0305];
    const serviceArea = [-26.1076,28.0567];

    const map = L.map('map').setView([-26.1929,28.0305], 13);
    L.titleLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Marker 1: for the business location
    L.marker(braamfontein).addTo(map)
    .bindPopup("<h3>Our Location</h3><p>We are located in Braamfontein, Johannesburg.</p>")
    .openPopup();
    // Marker 2: for the service area
    L.marker(randburg).addTo(map)
    .bindPopup("<h3>Service Area</h3><p>We provide services in the greater Johannesburg area.</p>");
    map.fitBounds([braamfontein, randburg], {padding: [50, 50]});
    // show both markers
}
// form validation for helpers
function setError(input, message){
    const error = document.getElementById(input.id + "Error");
    if(error){
        error.textContent = message;
        input.classList.add("invalid", message !== "");
        return message === "";
    }
    function checkField(input){
        const v = input.value.trim();
        switch(input.id){
            case "fullNamame":
                return setError(input, v.length < 2 ? "Please enter your full name." : "");
            case "email":
                return setError(input, v === "" ? "Please enter a valid email" : !/^[^@]+@[^@]+\.[^@]+$/.test(v) ? "Invalid email address." : "");
            case "phone":
                return setError(input, v === "" ? "Please enter a valid phone number." : !/^\+?\d{10,15}$/.test(v) ? "IEnter a south african number." : "");
            case "service":
            case "messageType":
                return setError(input, v === "" ? "Please choose an option." : "");
            case "message":
                return setError(input, v.length < 10 ? "Please enter a message of at least 10 characters." : "");
        }
        return true;
    }
function validateForm(form){
    let ok = true;
    form.querySelectorAll("input, select, textarea").forEach(f => { if(!checkField(f)) ok = false; });
    return ok;
}
function liveValidation(form){
    form.querySelectorAll("input, select, textarea").forEach(f => {
        f.addEventListener("blur", () => checkField(f));
    });
}
}

// Enquiry form
const enquiryForm = document.getElementById("enquiryForm");
if(enquiryForm){
    liveValidation(enquiryForm);
    enquiryForm.addEventListener("submit", async e => { 
        e.preventDefault();
        const status = document.getElementById("formStatus");
        if(validateForm(enquiryForm)){
            status.textContent = "Please fix the errors above and try again.";
            status.className = " Status error";
            return;
        }
        const data = Object.fromEntries(new FormData(enquiryForm).entries());
        const chosen = services.find(s => s.name === data.service);
        status.textContent = "Sending your enquiry...";
        status.className = "Status";
        try{
            const endpoint = enquiryForm.dataset.endpoint;
            // URL
            if(endpoint){
                const res = await fetch(endpoint, { method: "Post",
                    headers: {"Content-Type": "application/json","Accept":"application/json"},
                    body: JSON.stringify(data)
                });
                if(!res.ok) throw new Error("Service Error");}
                else{await new Promise(r => setTimeout(r,800));
                }
                status.className = "status success";
                status.innerHTML = `Thank you for your enquiry. We will get back to you soon.<br>
                <strong>Service:</strong> ${chosen.name}<br>
                <strong>Price:</strong> $${chosen.price.toFixed(2)}`;
                enquiryForm.reset();
        }catch(err){
            status.textContent = "There was an error sending your enquiry. Please try again later.";
            status.className = "status error";
        }
    });
            }
// contact form
const contactForm = document.getElementById("contactForm");
if(contactForm){
    const RECIPIENT = "info@alldaysplumbing.co.za";
    liveValidation(contactForm);
    contactForm.addEventListener("submit", async e => {
        e.preventDefault();
        const status = document.getElementById("formStatus");
        if(!validateForm(contactForm)){
            status.textContent = "Please fix the errors above and try again.";
            status.className = "status error";
            return;
        }
        const d = Object.fromEntries(new FormData(contactForm).entries());
        const subject = '${d.messageType}' - '${d.fullName}';
        const body = 'Name: ${d.fullname}\nEmail: ${d.email}\nPhone:${d.phone)\nType: ${d.messageType}\n\nMessage:\n${d.message}';

        status.className = "status success";
        status.innerHTML = `Your email is ready. <a class="btn" href"mailto:${RECIPIENT}?
        subject=${encodeURIComponent(subject)} &body=${encodeURIComponent(body)}>Send email to ${RECIPIENT}</a>`;
    });
}

// fade cards in when they are busy scrolling into view
const fadeItems = document.querySelectorAll(".fade-in");
if("IntersectionObserver" in window){
    const obs = new IntersectionObserver(entries =>{
        entries.forEach(en => { if(en.isIntersecting)
        {en.target.classList.add("visible"); obs.observe(en.target);}});
    }, {threshold: 0.15});
    fadeItems.forEach(el => obs.observe(el));
}else{
    fadeItems.forEach(el => el.classList.add("visible"));
}