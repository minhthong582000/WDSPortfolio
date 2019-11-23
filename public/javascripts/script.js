function deletePicture(id, name) {
    var cf = confirm('Bạn có chắc chắn muốn xóa ảnh này không');
    if(cf) {
        window.location.href='/activities/'+id+'?img='+name;
    }
}