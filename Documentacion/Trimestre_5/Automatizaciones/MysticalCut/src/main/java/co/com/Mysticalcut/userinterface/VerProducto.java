package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class VerProducto extends PageObject {

    public static Target BTN_PRODUCTS = Target.the("Ir al modulo de productos ").located(By.xpath("//*[@id=\"app\"]/div/div[1]/header/ul/li[4]/a"));

    public static Target MENSAJE_VIEW_DESCRIP = Target.the("Descripcion del servicio").located(By.xpath("/html/body/div/div/div/div/div[2]/div[1]/h2"));

    public static Target MENSAJE_VIEW_PRODUCTS = Target.the("NOMBRE DEL SERVICIO").located(By.xpath("/html/body/div/div/div/div/header/ul[2]/h1"));
}