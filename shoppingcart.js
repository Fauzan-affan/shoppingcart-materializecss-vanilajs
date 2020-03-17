if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready)
}else{
    ready()
}

function ready(){
    var s = document.getElementsByClassName("browser-default");
    for (let i = 0; i < s.length; i++) {
        var semuaElementSelect = s[i]
        semuaElementSelect.addEventListener("change", rubahCart)
    }

    var t = document.getElementsByClassName("pulse")
    for (let i = 0; i < t.length; i++) {
        var semuaButtonTambah = t[i]
        semuaButtonTambah.addEventListener("click", klikButtonTambah)
    }

    document.getElementsByClassName("beli")[0].addEventListener("click", beli)
}

function rubahCart(e){
    var nol = e.target
    var selectNol = nol.value
    if (selectNol <= 0 || isNaN(selectNol)) {
        nol.parentElement.parentElement.remove()
        selectNol = 1;
    }
    updateTotal()
}

function klikButtonTambah(e){
    var buttonTambah = e.target
    var cart = buttonTambah.parentElement.parentElement.parentElement
    
    var namaBarang = cart.getElementsByClassName("card-title")[0].innerText
    var hargaBarang = cart.getElementsByClassName("card-action")[0].innerText

    tambahBarang(namaBarang,hargaBarang)
    updateTotal()
}

function tambahBarang(nama, harga){
    var tanpaRp = parseFloat(harga.replace("Rp. ", ""))
    var divBaru = document.createElement("div")

    var existingNaga = document.getElementsByClassName("nama-naga")
    for (let i = 0; i < existingNaga.length; i++) {
        if (existingNaga[i].value == nama) {
            M.toast({html: nama + " sudah ada di cart", classes: "rounded"});
            return
        }
    }
    
    divBaru.classList.add("row")

    var targetDiv = document.getElementsByClassName("isiCart")[0]
    
    var isiDiv = `
    <div class="input-field col s6">
        <input disabled class="nama-naga" type="text" value="${nama}">
    </div>
    <div class="input-field col s3">
        <input disabled class="harga" type="text" value="${tanpaRp} JT">
    </div>
    <div class="col s3">
        <label>Jumlah</label>
        <select class="browser-default">
            <option value="0">0</option>
            <option value="1" selected>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    </div>`
    divBaru.innerHTML = isiDiv
    targetDiv.append(divBaru)
    M.toast({html: nama + " ditambahkan ke cart", classes: "rounded"});
    divBaru.getElementsByClassName("browser-default")[0].addEventListener("change", rubahCart)
}

function updateTotal(){

    var wadah = document.getElementsByClassName("isiCart")[0];
    var cartRow = wadah.getElementsByClassName("row");

    var total = 0;
    for (let i = 0; i < cartRow.length; i++) {
        var row = cartRow[i]
        var hargaElement = row.getElementsByClassName("harga")[0]
        var jumlahElement = row.getElementsByClassName("browser-default")[0]

        // untuk mengatasi error jika klik tombol beli saat total kosong sebanyak 3x
        // pake .replace("JT", "")
        var harga = parseFloat(hargaElement.value.replace("JT", ""))
        var jumlah = jumlahElement.value

        total = total + (harga * jumlah)
    }
    document.getElementsByClassName("total")[0].value = convertToRupiah(total) + ".000.000,-"
}

function beli(e){
    var total = e.target
    var totalKeranjang = total.parentElement
    var a = totalKeranjang.getElementsByClassName("total")[0]

    document.getElementById("jumlah-pembayaran").innerText = "Rp. " + a.value

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    document.getElementsByClassName("bayar")[0].addEventListener("click", bayar)
}

function bayar(){
    var isiCart = document.getElementsByClassName("isiCart")[0]
    while(isiCart.hasChildNodes()){
        isiCart.removeChild(isiCart.firstChild)
    }

    updateTotal()
    var a = document.getElementsByClassName("total")[0]
    var kosong = parseFloat(a.value)
    document.getElementsByClassName("total")[0].value = kosong
}