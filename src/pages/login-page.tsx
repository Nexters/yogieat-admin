import React, { FormEvent, useState } from "react";
import { Button } from "../shared/ui";

export function LoginPage() {
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<main className="auth-root">
			<section className="auth-shell" aria-label="Admin login">
				<section
					className="auth-showcase"
					aria-label="Service highlights"
				>
					<div className="auth-showcase__visual">
						<img
							src="/images/opinion/opinion-intro.svg"
							alt="맛집 추천 서비스 관리 일러스트"
							className="auth-showcase__main"
						/>
					</div>

					<div className="auth-showcase__foods" aria-hidden>
						<img src="/images/foodCategory/korean.svg" alt="" />
						<img src="/images/foodCategory/japanese.svg" alt="" />
						<img src="/images/foodCategory/chinese.svg" alt="" />
						<img src="/images/foodCategory/western.svg" alt="" />
						<img src="/images/foodCategory/asian.svg" alt="" />
					</div>
				</section>

				<section className="auth-panel">
					<div className="auth-panel__brand">
						<p className="auth-panel__eyebrow">
							요기잇 관리자 대시보드
						</p>
						<h1>로그인</h1>
						<p className="auth-panel__description">
							아이디와 비밀번호를 입력해 관리자 대시보드에
							접속하세요.
						</p>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<label className="auth-field">
							<span>아이디</span>
							<input
								type="text"
								placeholder="아이디를 입력하세요"
								value={userId}
								onChange={(event) =>
									setUserId(event.target.value)
								}
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

						<p className="auth-form__hint">
							관리자 계정으로만 접근할 수 있습니다.
						</p>
						<Button
							className="auth-submit"
							variant="primary"
							type="submit"
						>
							로그인
						</Button>
					</form>
				</section>
			</section>
		</main>
	);
}
