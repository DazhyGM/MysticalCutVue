package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.models.CredencialesLogin;
import co.com.Mysticalcut.tasks.AbrirPagina;
import co.com.Mysticalcut.tasks.Login;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class LoginStepsdefinitions {

    @Dado("^que el visitante está en la página de Mystical e ingresa a iniciarsesion$")
    public void queElVisitanteEstáEnLaPáginaDeMysticalEIngresaAIniciarsesion() {
        theActorInTheSpotlight().wasAbleTo(AbrirPagina.laPagina());
    }


    @Cuando("^ingresa las credenciales básicas:$")
    public void ingresaLasCredencialesBásicas(List<CredencialesLogin> credenciales) {
        theActorInTheSpotlight().attemptsTo(Login.aute(credenciales));
    }

    @Entonces("^debe ser redirigido a la vista home$")
    public void debeSerRedirigidoALaVistaHome() {

    }
}
