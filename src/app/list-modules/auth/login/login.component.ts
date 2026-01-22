import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService, routes } from 'src/app/core/core.index';
import { WebStorage } from 'src/app/core/services/storage/web.storage';

interface returndata {
  message: string | null;
  status: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public routes = routes;
  public CustomControler!: string | number | returndata;
  public subscription: Subscription;
  public Loginvalue = new BehaviorSubject<string | number | returndata>(0);
  public Toggledata = true;
  errorMessage: string | null = null;

  showloader = false;
  form = new UntypedFormGroup({
    email: new UntypedFormControl('admin2@gmail.com', [Validators.required]),
    password: new UntypedFormControl('MotDePasse123', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    private router: Router,
    private storage: WebStorage,
    private authservice: AuthService
  ) {
    this.subscription = this.storage.Loginvalue.subscribe((data) => {
      if (data !== 0) {
        this.CustomControler = data;
      }
    });
  }

  ngOnInit() {
    // this.storage.Checkuser();
    // localStorage.removeItem('LoginData');
  }

  submit() {
    this.showloader = true;
    $('#spinner').removeClass('d-none');
    this.errorMessage = ''; // Optionnel: Réinitialiser le message d'erreur

    this.authservice.login(this.form.value).subscribe(
        // --- Gestion de la réponse réussie (Code HTTP 200) ---
        (data: any) => {
            // Le backend renvoie toujours un code 200 en cas de succès et utilise 'success: true'
            // ou 'success: false' si le compte est inactif mais les identifiants sont corrects.
            // Il est plus sûr de vérifier 'success: true' dans le corps.

            if (data.success === true) {
                console.log(data);

                // La structure de la donnée est maintenant dans data.data
                const loginData = data.data;

                this.Loginvalue.next('Login success');

                // Stockage des données (adaptation aux nouvelles clés si nécessaire)
                // Note : Vous stockiez LoginData et LoginToken avec la même valeur (token) - j'ai gardé cela
                localStorage.setItem('LoginData', loginData.token);
                localStorage.setItem('LoginToken', loginData.token);

                // Le détail de l'utilisateur est maintenant dans loginData.user
                localStorage.setItem('userData', loginData.user); // Stocke l'objet User comme une chaîne [Object object]
                localStorage.setItem(
                    'userDataString',
                    JSON.stringify(loginData.user) // Recommandé: Stocker l'objet JSON sérialisé
                );

                // Vous pouvez aussi stocker les permissions si vous en avez besoin plus tard
                localStorage.setItem(
                    'userPermissions',
                    JSON.stringify(loginData.perm)
                );

                localStorage.setItem('logintime', Date());

                // Affichage et redirection
                setTimeout(() => {
                    this.showloader = false;
                    $('#spinner').addClass('d-none');
                    this.router.navigate(['/dashboard/admin']);
                }, 100);

                this.Loginvalue.next(0);

            } else {
                // Ce bloc ne devrait théoriquement pas être atteint si le backend renvoie
                // un code HTTP 200 uniquement pour 'success: true', mais il est là pour la robustesse.
                // Selon votre backend, un compte inactif peut renvoyer 200 avec success: false
                // ou un 403, auquel cas cela serait géré dans le bloc d'erreur.
                this.showloader = false;
                $('#spinner').addClass('d-none');
                alert(data.message || 'Échec de la connexion.');
            }
        },

        // --- Gestion des erreurs (Codes HTTP 4xx, 5xx) ---
        (error: any) => {
            $('#spinner').addClass('d-none');
            this.showloader = false;

            console.error("Erreur de connexion:", error);

            // Vérifier le statut HTTP et le corps de l'erreur
            if (error.status === 401) {
                // Code 401: Non autorisé (Identifiants incorrects)
                this.errorMessage = "Identifiants incorrects (E-mail ou mot de passe) !";
                // Vous pouvez aussi utiliser le message du backend : error.error.message
                // this.errorMessage = error.error.message;
            } else if (error.status === 403) {
                // Code 403: Interdit (Compte inactif)
                // Le message d'erreur est disponible dans error.error.message ou error.error.errors.failed
                this.errorMessage = error.error.message || "Compte inactif. Veuillez contacter un administrateur.";
            } else {
                // Autres erreurs (ex: 500 Internal Server Error, erreur réseau, etc.)
                this.errorMessage = "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
            }

            // Note : Si vous voulez afficher une pop-up :
            // alert(this.errorMessage);
        }
    );
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }
}
