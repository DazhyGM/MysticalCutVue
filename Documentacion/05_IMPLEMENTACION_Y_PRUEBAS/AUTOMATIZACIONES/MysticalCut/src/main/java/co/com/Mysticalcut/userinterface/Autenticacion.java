package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class Autenticacion extends PageObject {
    public static Target BTN_INICIOSESION = Target.the("Click Boton Iniciar sesion").located(By.xpath("//*[@id=\"app\"]/div[1]/header/div[2]/a[1]"));
    public static Target INPUT_USUARIO = Target.the(" Ingreso del Usuario").located(By.id("email"));
    public static Target INPUT_CLAVE = Target.the("Ingreso del password").located(By.id("password"));
    public static Target BTN_INICIO = Target.the("Click Boton inicio sesion").located(By.xpath("//*[@id=\"app\"]/div/div/form/button"));
    public static Target MENSAJE_LOGIN = Target.the("mensaje de login").located(By.xpath("//*[@id=\"app\"]/div/div[1]/header/div[2]/div/button"));
}
