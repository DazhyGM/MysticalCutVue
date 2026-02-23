package co.com.Mysticalcut.tasks;

import co.com.Mysticalcut.models.CredencialesRecuperarContrase;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;


import java.util.List;

import static co.com.Mysticalcut.userinterface.autenticacionRecuperarContrase.*;

public class AutenticarseRecuperarContrase implements Task{

    private List<CredencialesRecuperarContrase> credencialesRecuperar;


    public  AutenticarseRecuperarContrase(List<CredencialesRecuperarContrase> credencialesRecuperar){ this.credencialesRecuperar = credencialesRecuperar;}

    public static AutenticarseRecuperarContrase aute(List<CredencialesRecuperarContrase> credencialesRecuperar){
        return Instrumented.instanceOf(AutenticarseRecuperarContrase.class).withProperties(credencialesRecuperar);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_INICIOSESION),
                Click.on(BTN_RECUPERARCONTRASE),
                Click.on(INPUT_CORREO),
                Enter.theValue(credencialesRecuperar.get(0).getcorreo_electronico()).into(INPUT_CORREO),
                Click.on(BTN_ENVIAR)

        );
    }
}