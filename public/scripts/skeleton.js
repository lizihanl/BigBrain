"use strict";

function loadSkeleton() {
    console.log($('#navbar').load('/common/header.html'));
    console.log($('#footer').load('/common/footer.html'));
}
loadSkeleton(); //invoke the function