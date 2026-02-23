package co.com.Mysticalcut.models;

public class CredencialesBuscarUsuario {

    private String cedula;

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }



    public CredencialesBuscarUsuario(String cedula) {
        this.cedula = cedula;
    }
}