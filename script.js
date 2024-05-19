function val(){
    var name= document.getElementById("name").value;
    var email= document.getElementById("email").value;
    var pass= document.getElementById("pass").value;
    var cpass= document.getElementById("cpass").value;
    var error= document.getElementById("error_message");
    var text;
    error.style.padding = "10px";

    if(name.length < 6){
        text = "Name Should be more than 6 characters";
        error.innerHTML = text;
        return false;
    }
    if(email.indexOf("@") == -1 || email.length < 6){
        text = "Your email is invalid.";
        error_message.innerHTML = text;
        return false;
    }
    if(pass.length < 8){
        text = "Password Should be more than 8 characters";
        error.innerHTML = text;
        return false;
    }
    if(pass != cpass){
        text = "Password does not match";
        error.innerHTML = text;
        return false;
    }
    var frm = document.getElementById("myform");
    frm.style.display = 'none';
    var hid = document.getElementById("hid");
    hid.style.display = 'none';
    var disp = document.getElementById("success");
    disp.style.display = 'block';
    error.style.padding = "0px";
    return false;
}
