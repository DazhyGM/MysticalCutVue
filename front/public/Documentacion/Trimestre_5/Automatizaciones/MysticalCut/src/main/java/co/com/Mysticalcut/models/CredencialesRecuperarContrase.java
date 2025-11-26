package co.com.Mysticalcut.models;

public class CredencialesRecuperarContrase {

    private String correo_electronico;


    public String getcorreo_electronico() {
        return correo_electronico;
    }

    public void setcorreo_electronico(String correo_electronico) {
        this.correo_electronico = correo_electronico;
    }


    public CredencialesRecuperarContrase(String correo_electronico) {
        this.correo_electronico = correo_electronico;

    }


}
