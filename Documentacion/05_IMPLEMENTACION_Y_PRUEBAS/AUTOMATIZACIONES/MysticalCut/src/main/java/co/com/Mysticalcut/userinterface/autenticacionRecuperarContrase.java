package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class autenticacionRecuperarContrase extends PageObject{

    public static Target BTN_INICIOSESION = Target.the("Click Boton inicio sesion").located(By.xpath("//*[@id=\"app\"]/div[1]/header/div[2]/a[1]"));
    public static Target BTN_RECUPERARCONTRASE = Target.the("Click Boton inicio sesion").located(By.xpath("//*[@id=\"app\"]/div/div/form/div/a[1]"));
    public static Target INPUT_CORREO = Target.the(" Ingreso del Usuario").located(By.xpath("//*[@id=\"app\"]/div/form/input"));
    public static Target BTN_ENVIAR = Target.the("Click Boton inicio sesion").located(By.xpath("//*[@id=\"app\"]/div/form/button"));

    public static Target MENSAJE_LOGIN = Target.the("mensaje de login").located(By.xpath("//*[@id=\"app\"]/div/p[2]"));


}
