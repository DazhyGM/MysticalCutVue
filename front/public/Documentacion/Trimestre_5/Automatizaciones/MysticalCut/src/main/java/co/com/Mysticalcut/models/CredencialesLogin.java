package co.com.Mysticalcut.models;

public class CredencialesLogin {

    private String correo;

    private String contraseña;


    public String getCorreo() { return correo;}

    public void setCorreo(String Correo) { this.correo = Correo;}

    public String getContraseña() {return contraseña;}

    public void setContraseña(String Contraseña) {this.contraseña = Contraseña;}

    public CredencialesLogin(String Correo, String Contraseña){
        this.correo = Correo;
        this.contraseña = Contraseña;
    }
}
