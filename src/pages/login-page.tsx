import React, { FormEvent, useState } from "react";
import { Button, SystemIllustration } from "../shared/ui";

export function LoginPage() {
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<main className="auth-root">
			<section className="auth-card" aria-label="Admin login">
				<div className="auth-card__brand">
					<span className="auth-card__icon" aria-hidden>
						<SystemIllustration type="heart" />
					</span>
					<p className="auth-card__eyebrow">Yogieat Admin</p>
					<h1>로그인</h1>
					<p className="auth-card__description">
						아이디와 비밀번호를 입력해 관리자 대시보드에 접속하세요.
					</p>
				</div>

				<form className="auth-form" onSubmit={handleSubmit}>
					<label className="auth-field">
						<span>아이디</span>
						<input
							type="text"
							placeholder="아이디를 입력하세요"
							value={userId}
							onChange={(event) => setUserId(event.target.value)}
							autoComplete="username"
						/>
					</label>

					<label className="auth-field">
						<span>비밀번호</span>
						<input
							type="password"
							placeholder="비밀번호를 입력하세요"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							autoComplete="current-password"
						/>
					</label>

					<Button
						className="auth-submit"
						variant="primary"
						type="submit"
					>
						로그인
					</Button>
				</form>
			</section>
		</main>
	);
}
