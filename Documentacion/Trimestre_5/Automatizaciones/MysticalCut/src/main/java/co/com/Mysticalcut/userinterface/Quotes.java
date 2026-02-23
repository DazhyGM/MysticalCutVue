package co.com.Mysticalcut.userinterface;

import net.serenitybdd.core.annotations.findby.By;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;

public class Quotes extends PageObject {

    public static Target BTN_SERVICES = Target.the("Ir al modulo de servicio ").located(By.xpath("//*[@id=\"app\"]/div/div[1]/header/ul/li[2]/a"));

    public static Target LI_CATEGORIES = Target.the("Elegir la categoria ").located(By.xpath("//a[@href='#cortes' and normalize-space(text())='Cortes']\n"));

    public static Target BTN_SERVICES_SELECT = Target.the("Seleccionar servicio ") .located(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div/div[1]/div/div[1]/div/div/div[2]/div/button"));

    public static Target BTN_CONTINUE_SERVICES = Target.the("Confirmar servicio ").located(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div[2]/div/button[2]"));

    public static Target BTN_BARBER = Target.the("Seleccionar Barbero ").located(By.xpath("//*[@id=\"app\"]/div/div/div[1]/div/div[1]/div/button"));

    public static Target BTN_CONTINUE_BARBER = Target.the("Confirmar Barbero ").located(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div/div[3]/button[2]"));

    public static Target BTN_MONTH = Target.the("Seleccionar mes ").located(By.xpath("//div[@class='calendar-header']/button[2]"));

    public static Target BTN_DAY = Target.the("Seleccionar dia ").located(By.xpath("//*[@id=\"app\"]/div/div/div[1]/div[2]/div[2]/div[32]"));

    public static Target SPECIFIC_TIME_SLOT1 = Target.the("Seleccionar hora para hacer scroll ").located(By.xpath("//*[@id=\"app\"]/div/div/div[1]/div[3]/div/button[3]"));

    public static Target BTN_HOUR = Target.the("Seleccionar hora  ").located(By.xpath("//*[@id=\"app\"]/div/div/div[1]/div[3]/div/button[4]"));


    public static Target BTN_CONFIRM_CALENDAR = Target.the("Confirmar Cita  ").located(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div[2]/div[2]/button[1]"));


    public static Target MENSAJE_QUOTES_EMAIL = Target.the("Correo Cliente").located(By.xpath("//*[@id=\"app\"]/div/div/div/div/div[5]/span[2]"));

    public static Target MENSAJE_QUOTES_SERVICES = Target.the("servicio seleccionado").located(By.xpath("/html/body/div/div/div/div/div/div/div[1]/span[2]"));

    public static Target MENSAJE_QUOTES_BARBER = Target.the("Cbarbero seleccionado").located(By.xpath("/html/body/div/div/div/div/div/div/div[2]/span[2]"));

}
