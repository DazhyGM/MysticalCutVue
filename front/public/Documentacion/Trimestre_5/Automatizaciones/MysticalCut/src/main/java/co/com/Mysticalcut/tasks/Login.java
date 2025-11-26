package co.com.Mysticalcut.tasks;

import co.com.Mysticalcut.models.CredencialesLogin;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;

import java.util.List;

import static co.com.Mysticalcut.userinterface.LoginAU.*;

public class Login implements Task {

    private List<CredencialesLogin> credenciales;


    public Login(List<CredencialesLogin> credenciales) {
        this.credenciales = credenciales;
    }

    public static Login aute(List<CredencialesLogin> credenciales) {
        return Instrumented.instanceOf(Login.class).withProperties(credenciales);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(INPUT_INICIARSESION),
                Click.on(INPUT_CORREO),
                Enter.theValue(credenciales.get(0).getCorreo()).into(INPUT_CORREO),
                Click.on(INPUT_C0NTRASEÑA),
                Enter.theValue(credenciales.get(0).getContraseña()).into(INPUT_C0NTRASEÑA),
                Click.on(BTN_INICIARSESION)
        );
    }

}
