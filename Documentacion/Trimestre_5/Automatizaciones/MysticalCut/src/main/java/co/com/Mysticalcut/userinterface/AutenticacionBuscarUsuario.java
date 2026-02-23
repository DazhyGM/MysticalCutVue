package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class AutenticacionBuscarUsuario extends PageObject {

    public static Target BTN_USUARIOS = Target.the("Ir al modulo de usuarios ").located(By.xpath("//*[@id=\"app\"]/div/div[1]/header/ul/li[2]/a"));
    public static Target INPUT_USUARIOS = Target.the("Dar click para escribir la cedula ").located(By.xpath("//*[@id=\"app\"]/div/div[1]/div[2]/input"));
    public static Target MENSAJE_USUARIOS = Target.the("Nombre Cliente").located(By.xpath("//*[@id=\"app\"]/div/div[2]/div/h5"));

}
