package co.com.Mysticalcut.tasks;

import co.com.Mysticalcut.userinterface.Login;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

public class AbrirPagina implements Task {

    Login login;

    public static AbrirPagina laPagina(){ return Tasks.instrumented(AbrirPagina.class); }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.wasAbleTo(Open.browserOn(login));

    }
}
