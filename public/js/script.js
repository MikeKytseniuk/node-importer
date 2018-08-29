let tableBody = document.getElementById('contacts');


let request = {
    delete: function (url, data) {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
           
            if(xhr.status === 200) {
                location.reload();
            }
        }

        xhr.send(JSON.stringify({ email: data }));
    }
}


if (tableBody) {
    tableBody.addEventListener('click', function (e) {
        let action = e.target.value;

        if (action === 'edit') {
            location.href = `/editContact/${e.target.dataset.id}`;
        }

        if (action === 'delete') {
            request.delete('/deleteContact', e.target.dataset.id);
        }


    });
}





