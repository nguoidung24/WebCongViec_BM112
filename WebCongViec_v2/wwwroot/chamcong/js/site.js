
$(".menu > ul > li").click(function (e) {
/*
        // Remove the 'active' class from other menu items
        $(this).siblings().removeClass("active");
        // Toggle the 'active' class on the clicked menu item
        $(this).toggleClass("active");*/
        // Toggle the visibility of the submenu
        $(this).find("ul").slideToggle();
        // Close other submenus if they are open
        $(this).siblings().find("ul").slideUp();
        // Remove the 'active' class from submenu items
        $(this).siblings().find("ul").find("li").removeClass("active");
    if ($(this).has('.rotate-180deg').length > 0) {
        if ($(this).has('.sub-menu').length > 0) {
            console.log($(this).find(".arrow").toggleClass("rotate-180deg"))
        } else {
            console.log("Không có submenu");
        }
    } else {

        $(".menu ul li ").find(".rotate-180deg").toggleClass("rotate-180deg")

        if ($(this).has('.sub-menu').length > 0) {
            console.log($(this).find(".arrow").toggleClass("rotate-180deg"))
        } else {
            console.log("Không có submenu");
        }
    }

});


const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

$(document).ready(function () {
    var queryString = window.location.search;

    var urlParams = new URLSearchParams(queryString);

    var message = urlParams.get('message');
    var messageType = urlParams.get('messageType');
    if (messageType != null) {
        Toast.fire({
            icon: messageType,
            title: message
        });

    }
});



let isFull;
$(document).ready(function () {

    $(".menu ul li.active .arrow").toggleClass("rotate-180deg")



    if (localStorage.getItem("isFull") == "true") {
        $(".sidebar").toggleClass("active");
        document.querySelector("#main-content").classList.add("main-content-full");
        isFull = false;
    } else {
        document.querySelector("#main-content").classList.add("main-content");
        isFull = true;
    }



    $(".menu-btn").click(function () {
        // Toggle the 'active' class on the sidebar
        $(".sidebar").toggleClass("active");
        if (isFull) {
            document.querySelector("#main-content").classList.remove("main-content")
            document.querySelector("#main-content").classList.add("main-content-full")
            localStorage.setItem("isFull", "true")
        } else {
            document.querySelector("#main-content").classList.add("main-content")
            document.querySelector("#main-content").classList.remove("main-content-full")
            localStorage.setItem("isFull", "false")
        }
        isFull = !isFull;

    });
});


