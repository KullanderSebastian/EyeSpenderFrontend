
<div className="profilePageMenu">
<BsArrowLeftCircle onClick={goBack} />
<form>
	{errorState ? <p className="error">{errorState}</p> : null}
	<input
		name="currentPassword"
		key={1}
		value={currentPassword ? currentPassword : ""}
		onChange={handleChangePassword}
		placeholder="Nuvarande lösenord"
	/>
{currentPassword}
	<LineBreak />
	<input
		name="newPassword"
		key={2}
		value={newPassword ? newPassword : ""}
		onChange={handleChangePassword}
		placeholder="Nytt lösenord"
	/>
{newPassword}
	<LineBreak />
	<input
		name="newPasswordChecker"
		key={3}
		value={newPasswordChecker ? newPasswordChecker : ""}
		onChange={handleChangePassword}
		placeholder="Nytt lösenord"
	/>
{newPasswordChecker}
<button onClick={handleSubmitPassword}>Ändra lösenord</button>
</form>
</div>
