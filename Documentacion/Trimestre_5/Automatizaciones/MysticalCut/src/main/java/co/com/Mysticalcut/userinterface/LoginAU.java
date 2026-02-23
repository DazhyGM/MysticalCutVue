package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.screenplay.targets.Target;

public class LoginAU {

    public static Target INPUT_INICIARSESION = Target.the(" Boton de ir a formulario iniciar sesion ").located(By.xpath("/html/body/div/div/div[1]/header/div[2]/a[1]"));

    public static Target INPUT_CORREO = Target.the("Campo de correo electrónico en el formulario ").located(By.xpath("//*[@id=\"email\"]"));

    public static Target INPUT_C0NTRASEÑA= Target.the("Campo de contraseña en el formulario ").located(By.xpath("//*[@id=\"password\"]"));

    public static Target BTN_INICIARSESION = Target.the("Click Boton Iniciar Sesion").located(By.xpath("/html/body/div/div/div/div/form/button"));

}
