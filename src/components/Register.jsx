import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, getRedirectResult, signInWithRedirect, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, db, googleProvider } from "../config/firebase";
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Spinner from './Spinner';

const Register = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Krok 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isChecked, setIsChecked] = useState(false)
  const [googleUser, setGoogleUser] = useState(null);

  // Krok 2 - osobné údaje
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');

  // Krok 3
  const [activity, setActivity] = useState('1.2');
  const [goal, setGoal] = useState('maintain');
  const [calories, setCalories] = useState(null);
  const [isEditingBMI, setIsEditingBMI] = useState(false);
  const [caloriesCalculated, setCaloriesCalculated] = useState(false);

  // Vypočítane hodnoty
  const [dailyCalories, setDailyCalories] = useState(null);
  const [proteinGrams, setProteinGrams] = useState(null);
  const [fatGrams, setFatGrams] = useState(null);
  const [carbsGrams, setCarbsGrams] = useState(null);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gray-100 text-gray-900 py-12 flex justify-center items-center">
        <Spinner />
      </section>
    );
  }

  // Funkcia na výpočet kalórií
  const calculateCalories = () => {
    const numWeight = Number(weight);
  const numHeight = Number(height);
  const numAge = Number(age);
  
  let BMR;
  if (gender === 'male') {
    BMR = 88.36 + (13.4 * numWeight) + (4.8 * numHeight) - (5.7 * numAge);
  } else {
    BMR = 447.6 + (9.2 * numWeight) + (3.1 * numHeight) - (4.3 * numAge);
  }

  let dailyCalories = BMR * Number(activity);
  if (goal === 'lose') dailyCalories -= 500;
  if (goal === 'gain') dailyCalories += 500;

    setCalories(Math.round(dailyCalories));
    setCaloriesCalculated(true);
  };

  const validateStepOne = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Prosím, zadaj platný email.');
      return false;
    }
    if (password.length < 8) {
      setError('Heslo musí mať aspoň 8 znakov.');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Heslo musí obsahovať aspoň 1 veľké písmeno (A-Z).');
      return false;
    }
    if (!/\d/.test(password)) {
      setError('Heslo musí obsahovať aspoň 1 číslicu.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Heslá sa nezhodujú.');
      return false;
    }
    if (!isChecked) {
      setError('Musíš súhlasiť s podmienkami používania a ochranou osobných údajov.');
      return false;
    }
    
    const checkEmailInFirestore = async (trimmedEmail) => {
      const q = query(collection(db, 'users'), where('email', '==', trimmedEmail))
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }
    try {
      // Overenie, či email už existuje
      const signInMethods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
      if (signInMethods.length > 0) {
        setError('Tento email už existuje.');
        return false;
      }

      const existInFirestore = await checkEmailInFirestore(trimmedEmail);
      if (existInFirestore) {
        setError("Tento email už existuje.")
        return false;
      }
    } catch (error) {
      console.error("Chyba pri overovaní emailu:", error);
      setError('Nastala chyba pri overovaní emailu.');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleNextStepOne = async () => {
    const isValid = await validateStepOne();
    if (isValid) {
      setStep(2);
    }
  };

  // Registrácia
  const handleRegister = async (e) => {
    e.preventDefault();
     setIsLoading(true);
     const trimmedEmail = email.trim().toLowerCase();
    try {
      // Vytvorenie užívateľa vo Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);

      // Nastavenie mena používateľa
      await updateProfile(userCredential.user, { displayName: name });

      // Poslanie overovacieho emailu
      await sendEmailVerification(userCredential.user);

      // Uloženie údajov do Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email: trimmedEmail,
        agreedToTerms: true,
        age,
        weight,
        height,
        gender,
        activity,
        goal,
        calories,
      });

      // Presmerovanie na verifikaciu
      setIsLoading(false)
      navigate('/verify-email');
    } catch (err) {
      setError('Chyba pri registrácii: ' + err.message);
    }
  };


  return (
    <section className='max-w-md mt-30 mx-auto py-10 px-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-3xl font-semibold text-center text-green-700'>Registrácia</h2>
      {error && <p className='text-red-600 text-center mt-2'>{error}</p>}

      <form onSubmit={handleRegister} className='mt-4'>

        {/* KROK 1 */}
        {step === 1 && (
          <>
            <label className='block mt-2'>Meno</label>
            <input 
              type="text"
              placeholder='Meno'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <label className='block mt-2'>Email</label>
            <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <label className='block mt-2'>Heslo</label>
            <input
              type="password"
              placeholder='Heslo'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <label className='block mt-2'>Potvrdiť heslo</label>
            <input
              type="password"
              placeholder='Potvrdiť heslo'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <div className="mt-6 flex items-start">
            <input 
              type="checkbox" 
              checked={isChecked} 
              onChange={() => setIsChecked(!isChecked)} 
              className="mr-2 ml-2 mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="text-gray-600 mr-5">
              Súhlasím s <Link to="/terms" className="text-blue-600 underline">podmienkami používania</Link> a <Link to="/privacy" className="text-blue-600 underline">ochranou osobných údajov</Link>.
            </label>
            </div>

            <button
              type='button'
              onClick={handleNextStepOne}
              className='bg-green-600 text-white px-6 py-2 mt-4 w-full rounded-lg hover:bg-green-700'
            >
              Ďalej
            </button>
          </>
        )}

        {/* KROK 2 */}
        {step === 2 && (
          <>
            <label className='block mt-2'>Vek</label>
            <input
              type="number"
              placeholder='Vek'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <label className='block mt-2'>Váha (kg)</label>
            <input
              type="number"
              placeholder='Váha (kg)'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <label className='block mt-2'>Výška (cm)</label>
            <input
              type="number"
              placeholder='Výška (cm)'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            />

            <label className='block mt-2'>Pohlavie</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            >
              <option value="male">Muž</option>
              <option value="female">Žena</option>
            </select>

            <button
              type='button'
              onClick={() => setStep(3)}
              className='bg-green-600 text-white px-6 py-2 mt-4 w-full rounded-lg hover:bg-green-700'
            >
              Ďalej
            </button>
          </>
        )}

        {/* KROK 3 */}
        {step === 3 && (
          <>
            <label className='block mt-2'>Cieľ</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            >
              <option value="lose">Schudnúť</option>
              <option value="maintain">Udržať váhu</option>
              <option value="gain">Nabrať svaly</option>
            </select>

            <label className='block mt-2'>Úroveň aktivity</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className='border border-gray-300 rounded-lg px-4 py-2 w-full'
            >
              <option value="1.2">Sedavý životný štýl</option>
              <option value="1.375">Ľahká aktivita (1-3x/týž)</option>
              <option value="1.55">Stredná aktivita (3-5x/týž)</option>
              <option value="1.725">Vysoká aktivita (6-7x/týž)</option>
              <option value="1.9">Extrémna aktivita</option>
            </select>

            <label className='block mt-2'>BMI / Kalórie</label>
            {isEditingBMI ? (
              <input
                type="number"
                value={calories || ""}
                onChange={(e) => setCalories(e.target.value)}
                className='border border-gray-300 rounded-lg px-4 py-2 w-full'
              />
            ) : (
              <p className="mt-2 font-semibold text-center">{calories} kcal</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                type='button'
                onClick={calculateCalories}
                className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
              >
                Vypočítať BMI
              </button>

              
              {caloriesCalculated && (
                <button
                  type='button'
                  onClick={() => setIsEditingBMI(!isEditingBMI)}
                  className='bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600'
                >
                  {isEditingBMI ? "Uložiť" : "Upraviť"}
                </button>
              )}
            </div>

            <button
              type='submit'
              className='bg-green-600 text-white px-6 py-2 mt-4 w-full rounded-lg hover:bg-green-700'
            >
              Registrovať sa
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default Register;