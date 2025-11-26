package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class View extends PageObject {

    public static Target BTN_SERVICES = Target.the("Ir al modulo de servicio ").located(By.xpath("//*[@id=\"app\"]/div/div[1]/header/ul/li[2]/a"));

    public static Target LI_CATEGORIES = Target.the("Elegir la categoria ").located(By.xpath("//a[@href='#cortes' and normalize-space(text())='Cortes']\n"));

    public static Target BTN_SERVICES_SELECT = Target.the("Ver servicio ").located(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div/div[1]/div/div[1]/div/div/div[2]/div/a"));

    public static Target MENSAJE_VIEW_DESCRIP = Target.the("Descripcion del servicio").located(By.xpath("/html/body/div/div/div/div/div[1]/div[2]/p[1]"));

    public static Target MENSAJE_VIEW_SERVICE = Target.the("NOMBRE DEL SERVICIO").located(By.xpath("/html/body/div/div/div/div/div[1]/div[2]/h3"));
}