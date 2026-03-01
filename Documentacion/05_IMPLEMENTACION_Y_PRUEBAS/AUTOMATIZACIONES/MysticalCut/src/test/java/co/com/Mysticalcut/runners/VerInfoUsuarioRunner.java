package co.com.Mysticalcut.runners;

import cucumber.api.CucumberOptions;
import cucumber.api.SnippetType;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;


@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        features = "src/test/resources/features/VerInfoUsuario.feature",
        glue = {"co.com.Mysticalcut.stepsdefinitions", "co.com.Mysticalcut.utils.hooks"},
        snippets = SnippetType.CAMELCASE)

public class VerInfoUsuarioRunner {
}
