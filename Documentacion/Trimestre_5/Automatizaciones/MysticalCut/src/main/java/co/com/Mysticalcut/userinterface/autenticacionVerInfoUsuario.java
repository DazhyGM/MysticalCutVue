package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class autenticacionVerInfoUsuario extends PageObject {

    public static Target BTN_USUARIO = Target.the("Ir al modulo de usuarios")
            .located(By.xpath("//*[@id='app']/div/div[1]/header/ul/li[2]/a"));

    public static Target USUARIO_SCROLL = Target.the("Seleccionar hora para hacer scroll")
            .located(By.xpath("//*[@id='app']/div/div[2]"));

    public static Target BTN_VER_USUARIO = Target.the("Ir al modulo de usuarios")
            .located(By.xpath("//*[@id='app']/div/div[2]/div[3]/div[2]/a[2]/img"));

    // ✅ Corrección aquí: Agregar `Target` antes del nombre
    public static final Target MENSAJE_VER_USUARIO = Target.the("Correo Cliente")
            .located(By.xpath("//*[@id=\"app\"]/div[2]/form/div/div[1]/label[3]"));

    public static final Target MENSAJE_NOMBRE_INPUT = Target.the("Nombre Cliente")
            .located(By.xpath("//*[@id=\"app\"]/div[2]/form/div/div[1]/label[2]"));

    public static final Target MENSAJE_TELEFONO_INPUT = Target.the("Telefono Cliente")
            .located(By.xpath("//*[@id=\"app\"]/div[2]/form/div/div[1]/label[4]"));
}
